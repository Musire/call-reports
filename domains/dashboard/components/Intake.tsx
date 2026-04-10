'use client';

import { Form, H2, Input } from "@/components/ui";
import { useJwt } from "@/hooks";
import z from "zod";

export default function Intake () {
    const {setToken} = useJwt()

    const schema = z.object({
        jwt: z.string().min(1, 'Input needed')
    })

    const handleSubmit = ({ jwt }: {jwt: string}) => {
        if (!jwt) return
        setToken(jwt)
    } 
    
    return (
        <div className="p-6 surface-1 rounded-2xl ">
            <Form
                initialValues={{ jwt: ''}}
                schema={schema}
                onSubmit={handleSubmit}
            >
                <H2 className="">Enter JWT</H2>
                <Input 
                    name="jwt"
                    label="Paste JWT token below: "
                />
            </Form>
        </div>
    );
}