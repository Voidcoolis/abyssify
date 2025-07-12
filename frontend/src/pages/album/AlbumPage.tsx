import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const AlbumPage = () => {
    const { albumId } = useParams(); // Get album ID from URL parameters
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
    
    useEffect(() => {
		if (albumId) fetchAlbumById(albumId); //if there is an album id then call the fetchAlbumById
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

  return (
    <div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-red-900/90 via-black/90
                    to-black pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='w-[240px] h-[240px] shadow-xl rounded'
							/>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-7xl font-bold my-4'>{currentAlbum?.title}</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									<span>• {currentAlbum?.songs.length} songs</span>
									<span>• {currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>						
					</div>
				</div>
			</ScrollArea>
		</div>
  )
}

export default AlbumPage