
interface IProps {
	children?: JSX.Element | JSX.Element[];
	isShown: boolean;
	close: () => void;
}
/**
 * A full screen modal with darkened background and smaller modal
 * shown in center.
 */
export default function Modal({
	children,
	isShown,
	close
}: IProps) {
	if(!isShown) {
		return null;
	}

	return (
		<div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40'>
			<div className='absolute w-full h-full top-0 left-0 z-0' onClick={close} />

			<div className='relative w-[90%] h-auto max-h-[70%] md:w-[650px] bg-slate-800 rounded-md z-10'>
				<div className='absolute top-0 right-0 mt-2 mr-4 text-2xl rotate-45 text-gray-300 hover:text-gray-100 cursor-pointer transition-all' onClick={close}>
					+
				</div>

				<div className='pt-10 w-full h-full overflow-auto px-5'>
					{children}
				</div>
			</div>
		</div>
	)
}