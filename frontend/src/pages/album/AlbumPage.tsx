import { useParams } from "react-router-dom"

const AlbumPage = () => {
    const params = useParams();
    console.log("Banana",params)
  return (
    <div>AlbumPage</div>
  )
}

export default AlbumPage