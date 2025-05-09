"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"

const frameworks = [
  {
    value: "Sân 7",
    label: "Sân 7",
  },
  {
    value: "Sân 5",
    label: "Sân 5",
  },
  {
    value: "Sân cỏ nhân tạo ",
    label: "Sân cỏ nhân tạo ",
  },
  {
    value: "Sân Futsal",
    label: "Sân Futsal",
  },
  {
    value: "Sân cỏ tự nhiên",
    label: "Sân cỏ tự nhiên",
  },
  {
    value: "Sân bóng đá mini",
    label: "Sân bóng đá mini",
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between "
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : <span className="opacity-50">Lựa chọn kiểu sân bạn cần tìm</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiểu sân " />
          <CommandList>
            <CommandEmpty>Không tìm thấy kiểu sân</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
