import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";

export default function SelectDropdown({
  value,
  onChange,
  options,
  renderLabel = (option) => option,
  width = "w-24",
  buttonClassName = "bg-slate-800 text-gray-200 border-slate-700",
  optionClassName = "text-gray-200",
  activeOptionClassName = "bg-blue-600/30 text-white",
  selectedOptionClassName = "font-medium",
  listBoxOptionsClassName,
}) {
  return (
    <div className={`relative h-10 ${width}`}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative h-full">
          <ListboxButton
            className={`relative w-full h-full cursor-pointer rounded-lg py-2 pl-3 pr-8
                        text-left focus:outline-none sm:text-sm
                        ${buttonClassName}`}
          >
            <span className="block truncate">{renderLabel(value)}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronsUpDown className="h-4 w-4 text-gray-400" />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptions
              className={`absolute top-full left-0 mt-1 w-full origin-top rounded-lg py-1
                         text-sm shadow-lg ring-opacity-5 focus:outline-none z-50 ${listBoxOptionsClassName}`}
            >
              {options.map((option) => (
                <ListboxOption
                  key={typeof option === "object" ? option.value : option}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer select-none py-2 pl-3 pr-4 ${
                      active ? activeOptionClassName : optionClassName
                    }`
                  }
                >
                  {({ selected }) => (
                    <span
                      className={`block truncate ${
                        selected ? selectedOptionClassName : "font-normal"
                      }`}
                    >
                      {renderLabel(option)}
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
