import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import CreateTemplate from '../components/CreateTemplate';
import { countries_list, security_levels } from '../lib/countries';
import { toast } from 'sonner';

const baseTemplates = [
    {
        name: "Non US Citizen over 18 with no money laundering flags",
        min_age: 18,
        restricted_countries: ["US"],
        aml_security_level: 2,
    }
]

// The templates page will let you create a new template to use the noir circuit, you can choose
// what security you need on the circuit and the system will give you the public inputs to the circuit
/**
    const formattedData = {
        min_age: 18,
        check_passport_validity: true,
        aml_security_level: 1,
        restricted_countries: ["US", "RU", "CN"],
    };
*/

// This page will have a mocked list deployed templates, and a button to create a new template
export default function Templates() {
    const [templates, setTemplates] = useState<any[]>(baseTemplates);

    // Function to add a new template
    const handleTemplateCreated = (newTemplate: any) => {
        setTimeout(() => {
            setTemplates([...templates, newTemplate]);
            toast.success("Template created successfully");
        }, 5000);
    }

    const copyPublicInputs = () => {
        navigator.clipboard.writeText(JSON.stringify(["0x0000000000000000000000000000000000000000000000000000000000000012","0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000111111111111111","0x0000000000000000000000000000000000000000000000000222222222222222","0x0000000000000000000000000000000000000000000000000333333333333333","0x0000000000000000000000000000000000000000000000000444444444444444","0x0000000000000000000000000000000000000000000000000555555555555555","0x0000000000000000000000000000000000000000000000000666666666666666","0x0000000000000000000000000000000000000000000000000777777777777777","0x0000000000000000000000000000000000000000000000000888888888888888","0x0000000000000000000000000000000000000000000000000999999999999999","0x0000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaa","0x0000000000000000000000000000000000000000000000000bbbbbbbbbbbbbbb","0x0000000000000000000000000000000000000000000000000ccccccccccccccc","0x0000000000000000000000000000000000000000000000000ddddddddddddddd","0x0000000000000000000000000000000000000000000000000eeeeeeeeeeeeeee","0x0000000000000000000000000000000000000000000000000fffffffffffffff"]));
        toast.success("Public inputs copied to clipboard");
    }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Templates</h1>
            <CreateTemplate onTemplateCreated={handleTemplateCreated} />
        </div>
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Min Age</TableHead>
                        <TableHead>Restricted Countries</TableHead>
                        <TableHead>AML Security Level</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {templates.map((template) => (
                        <TableRow key={template.name}>
                            <TableCell>{template.name}</TableCell>
                            <TableCell>{template.min_age}</TableCell>
                            <TableCell>{template.restricted_countries.map((country: string) => countries_list.find((c: any) => c.code === country)?.name).join(", ")}</TableCell>
                            <TableCell>{security_levels.find((level: any) => level.code === template.aml_security_level)?.name}</TableCell>
                            <TableCell>
                                <Button onClick={() => copyPublicInputs(template)}>Copy Public Inputs</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
