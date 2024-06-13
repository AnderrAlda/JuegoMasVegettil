import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast } from "sonner";
import { getSignedUrlForS3Object } from '@/lib/s3';
import { createUploadURL } from "@/lib/s3action";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface Category {
    title: string;
}

interface Game {
    _id: string;
    title: string;
    image: string;
    votes: number;
    category: string;
}



interface EditFormProps {
    game: Game; // Assuming Game interface is imported or defined here
    onClose: () => void;
    onUpdate: (updatedGame: Game) => void;

}

const formSchema = z.object({
    title: z.string().min(0).max(50),
    image: z.string().min(0).max(250),
    category: z.string().min(0).max(50)
});

const EditForm: React.FC<EditFormProps> = ({ game, onClose, onUpdate }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: game.title,
            image: game.image,
            category: game.category
        },
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Fetch categories or any other initial data if needed
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let imageUrl = values.image;

            if (selectedFile) {
                const signedUrl = await createUploadURL(selectedFile.name, selectedFile.type);
                await fetch(signedUrl, {
                    method: "PUT",
                    body: selectedFile,
                });
                imageUrl = selectedFile.name; // Update with the uploaded file name
            }

            // Make a PATCH request to update the game
            const response = await axios.patch(`/api/games`, {
                id: game._id,
                ...values,
                image: imageUrl // Ensure image URL is updated if changed
            });

            toast.success("Juego actualizado correctamente");
            console.log(response.data);

            form.reset();
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Update the image URL in the local state
            const updatedGame = { ...game, ...values, image: imageUrl };
            onUpdate(updatedGame);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error actualizando el juego");
        }
    }
    const [categories, setCategories] = useState<Category[]>();
    useEffect(() => {
        axios
            .get("/api/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titulo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ingrese el título" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Introduce el título del juego
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagen</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                                </FormControl>
                                <FormDescription>
                                    Elige la imagen del juego
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Elige una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.title} value={category.title}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Elige la categoría del juego
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Guardar</Button>
                </form>
            </Form>
        </div>
    );
};

export default EditForm;
