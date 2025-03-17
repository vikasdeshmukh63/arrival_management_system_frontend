import { SelectGroup } from '@radix-ui/react-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface SelectItemProps<T> {
    placeholder: string
    data: T[]
    onChange: (value: string) => void
    value: string | number
    getItemKey: (item: T) => string | number
    getItemLabel: (item: T) => string
}

const CustomSelect = <T,>({ placeholder, data, onChange, value, getItemKey, getItemLabel }: SelectItemProps<T>) => {
    return (
        <Select
            onValueChange={onChange}
            value={value.toString()}>
            {/* select trigger */}
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            {/* select content */}
            <SelectContent>
                {data.map((item) => (
                    <SelectGroup key={getItemKey(item)}>
                        <SelectItem value={getItemKey(item).toString()}>{getItemLabel(item)}</SelectItem>
                    </SelectGroup>
                ))}
            </SelectContent>
        </Select>
    )
}

export default CustomSelect
