
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';

interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    options?: string[];
}

interface GenericFormPageProps {
    title: string;
    description: string;
    icon: LucideIcon;
    formFields: FormFieldConfig[];
    formTitle: string;
    formDescription: string;
    buttonText: string;
}

export function GenericFormPage({ title, description, icon: Icon, formFields, formTitle, formDescription, buttonText }: GenericFormPageProps) {
    const { toast } = useToast();

    // Create default values dynamically to avoid uncontrolled to controlled error
    const defaultValues = React.useMemo(() => {
        return formFields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {} as Record<string, any>);
    }, [formFields]);

    const form = useForm({
        defaultValues,
    });

    const onSubmit = (data: any) => {
        console.log(data);
        toast({
            title: "Registro Guardado",
            description: "La información ha sido guardada exitosamente.",
        });
        form.reset(defaultValues);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Icon className="w-10 h-10 text-primary" />
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{formTitle}</CardTitle>
                            <CardDescription>{formDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formFields.map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name}
                                    render={({ field: formField }) => (
                                        <FormItem className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                {field.type === 'textarea' ? (
                                                    <Textarea placeholder={field.placeholder} {...formField} />
                                                ) : field.type === 'select' ? (
                                                    <Select onValueChange={formField.onChange} value={formField.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={field.placeholder} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {field.options?.map((option) => (
                                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : field.type === 'date' ? (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn("w-full justify-start text-left font-normal", !formField.value && "text-muted-foreground")}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {formField.value ? format(formField.value, "PPP") : <span>{field.placeholder || 'Seleccione una fecha'}</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar mode="single" selected={formField.value} onSelect={formField.onChange} initialFocus />
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <Input type={field.type} placeholder={field.placeholder} {...formField} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                {buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
