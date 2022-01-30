import { ChangeEventHandler, KeyboardEventHandler } from 'react';
import './Input.css';

export default function Input({ onChange, onSubmit, placeholder, extraClass }: InputProps) {
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            onSubmit()
        }
    }

    return <input className={'input ' + extraClass || ""} type="text" onChange={onChange} placeholder={placeholder} onKeyDown={handleKeyDown} />
}

interface InputProps {
    placeholder: string;
    onChange: ChangeEventHandler<HTMLInputElement>
    onSubmit: () => void;
    extraClass?: string;
}