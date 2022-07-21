import Image from 'next/image';
import Button from './Button';

interface IProps {
	title: string;
	subtitle: string;
	image: string;
	alt: string;
	width: number;
	height: number;
	buttonText: string;
	onClick: () => void;
	isButtonLoading?: boolean;
}
/**
 * Card element containing a thumbnail image to the left, with text and a button
 * to the right.
 */
export default function Card({
	title, subtitle, image, alt, width, height, buttonText, onClick, isButtonLoading
}: IProps) {
	return (
		<div className='flex flex-col items-center text-center md:items-stretch md:text-left md:flex-row w-full border-2 border-gray-700 rounded-lg p-5 mt-8 bg-gray-900'>
			<div className='w-[250px] relative'>
				<Image
					src={image}
					layout='responsive'
					width={width}
					height={height}
					alt={alt}
					className='rounded-lg'
				/>
			</div>
			
			<div className='flex flex-col items-start text-gray-100 md:ml-5 mt-5 md:mt-0'>
				<h2 className='text-xl font-semibold'>
					{title}
				</h2>

				<p className='mt-2 mb-5 md:mt-0 md:mb-0'>
					{subtitle}
				</p>

				<Button
					onClick={onClick}
					className='mt-auto w-full md:w-[300px]'
					loading={isButtonLoading}
				>
					{buttonText}
				</Button>
			</div>
		</div>
	)
}