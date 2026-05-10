'use client'

type ButtonProps = {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	label: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
};

export default function Button({onClick, label, type="button", disabled=false}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`px-4 py-2 text-white rounded transition ${disabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}>
			{label}
		</button>
	);
}