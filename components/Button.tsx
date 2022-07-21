import Image from 'next/image';

interface IProps {
	children: JSX.Element | JSX.Element[] | string;
	onClick: () => void;
	className?: string;
	loading?: boolean;
}
/**
 * Generic button, with support for loading indicator.
 */
export default function Button({
	children,
	onClick,
	className,
	loading
} : IProps) {
	return (
		<button className={`px-6 py-2 min-h-[55px] border-2 border-gray-400 font-semibold text-gray-400 rounded-lg hover:border-gray-100 hover:text-gray-100 transition-all ${className}`} onClick={onClick}>
			{!loading ? children : <Image src='/Spinner.png' layout='fixed' width={25} height={25} alt='Spinner' className='animate-spin' />}
		</button>
	)
}