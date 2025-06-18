import type { FC } from 'react';

interface inputTextProps {
    className:string
}

const InputText: FC<inputTextProps> = ({className,}:inputTextProps) => {
        return (
            <div>
                <input type='text' className={className}/>
            </div>
        );
}
export default InputText;