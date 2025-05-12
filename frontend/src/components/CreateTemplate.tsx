import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog'
import { countries_list, security_levels } from '../lib/countries';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import { CheckIcon, ChevronsUpDown, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'

// Define form schema
const formSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  minAge: z.number().min(0, "Min age must be at least 0"),
  restrictedCountries: z.array(z.string()).max(10, "You can select up to 10 countries"),
  amlSecurityLevel: z.number().min(0).max(2),
})

export default function CreateTemplate({ onTemplateCreated }: { onTemplateCreated: (template: any) => void }) {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: "",
      minAge: 0,
      restrictedCountries: [],
      amlSecurityLevel: 0,
    },
  })

  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const selectedCountries = form.watch("restrictedCountries")

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Format the template data to match the expected structure
    const newTemplate = {
      name: values.templateName,
      min_age: values.minAge,
      restricted_countries: values.restrictedCountries,
      aml_security_level: values.amlSecurityLevel,
    }
    
    // Pass the new template to the parent component
    onTemplateCreated(newTemplate)
    
    // Close the dialog
    setDialogOpen(false)
    
    // Reset the form
    form.reset()
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button>Create New Template</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Template</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details to create a new template.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Template Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Min Age" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="restrictedCountries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricted Countries</FormLabel>
                  <FormDescription>
                    Select up to 10 countries to restrict
                  </FormDescription>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {selectedCountries.length > 0
                            ? `${selectedCountries.length} countries selected`
                            : "Select countries"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search countries..." />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-60">
                            {countries_list.map((country) => (
                              <CommandItem
                                key={country.code}
                                value={country.name}
                                onSelect={() => {
                                  const isSelected = selectedCountries.includes(country.code)
                                  const newValue = isSelected
                                    ? selectedCountries.filter(c => c !== country.code)
                                    : selectedCountries.length < 10
                                      ? [...selectedCountries, country.code]
                                      : selectedCountries
                                  
                                  form.setValue("restrictedCountries", newValue)
                                }}
                              >
                                <CheckIcon
                                  className={`mr-2 h-4 w-4 ${
                                    selectedCountries.includes(country.code) ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {selectedCountries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCountries.map(code => {
                        const country = countries_list.find(c => c.code === code)
                        return (
                          <Badge key={code} variant="secondary" className="flex items-center gap-1">
                            {country?.name}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => {
                                form.setValue(
                                  "restrictedCountries", 
                                  selectedCountries.filter(c => c !== code)
                                )
                              }}
                            />
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amlSecurityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AML Security Level</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value !== undefined
                              ? security_levels.find(level => level.code === field.value)?.name || "Select level"
                              : "Select level"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button> 
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search security levels..." />
                          <CommandEmpty>No security level found.</CommandEmpty>
                          <CommandGroup>
                            {security_levels.map((level) => (
                              <CommandItem
                                key={level.code}
                                value={level.name}
                                onSelect={() => {
                                  form.setValue("amlSecurityLevel", level.code);
                                }}
                              >
                                <CheckIcon
                                  className={`mr-2 h-4 w-4 ${
                                    field.value === level.code ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {level.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Select the appropriate security level for this template</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit" onClick={form.handleSubmit(onSubmit)}>
                Create Template
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
