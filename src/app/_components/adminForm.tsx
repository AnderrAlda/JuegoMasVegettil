"use client"

import { useState, useRef } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from "sonner"
import { getSignedUrlForS3Object } from '@/lib/s3'
import { createUploadURL } from "@/lib/s3action"

const formSchema = z.object({
    title: z.string().min(2).max(50),
    image: z.string().min(0).max(250),
    votes: z.number(),
    category: z.string().min(2).max(50)
})

const AdminForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image: "",
            votes: 0,
            category: ""
        },
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!selectedFile) {
                throw new Error("No file selected");
            }

            console.log("file" + selectedFile.name + selectedFile.type)

            // Get a signed URL from Cloudflare
            const signedUrl = await createUploadURL(selectedFile.name, selectedFile.type);

            console.log("url" + signedUrl)

            await fetch(signedUrl, {
                method: "PUT",
                body: selectedFile,
            })

            // Update the values with the URL of the uploaded image
            values.image = selectedFile.name; // Remove query parameters

            const response = await axios.post('/api/games', values); // Make a POST request to your API endpoint
            toast.success("Juego creado correctamente");
            console.log(response.data);
            form.reset();
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
            toast.error("Error creando el juego");
        }
    }

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
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Introduce el titulo del juego
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
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Elige la categoria del juego
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default AdminForm