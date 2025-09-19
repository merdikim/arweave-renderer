import { useImage, useMarkDown, useVideo } from 'arweave-renderer-react';
import { useState } from 'react';

type TDataType = "image" | "video" | "markdown"

const isArweaveId = (addr: string) => /^[a-z0-9_-]{43}$/i.test(addr);

function App() {
  const [id, setId] = useState("")
  const [dataType, setDataType] = useState<TDataType>("image")
  const { image, isImageLoading, isImageError} = useImage(id)
  const { video, isVideoLoading, isVideoError} = useVideo(id)
  const { markDown, isMarkDownLoading, isMarkDownError} = useMarkDown(id)

  const changeType = (type:TDataType) => {
    setDataType(type)
    setId("")
  }

  return (
    <div className="h-screen w-screen flex flex-col px-4 items-center pt-20 bg-white">
      <h1 className='text-2xl font-semibold mb-16'>Arweave Renderer Test</h1>
      <div className='mb-10 max-w-[500px] w-full'>
        <div className='mb-4'>What's the Arweave ID data type ?</div>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <label htmlFor="image">Image</label>
            <input type="radio" value={"image"} onChange={(e) => changeType(e.target.value as TDataType)} checked={dataType == "image"} name="data_type" id="image" />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="video">Video</label>
            <input type="radio" value={"video"} onChange={(e) => changeType(e.target.value as TDataType)} checked={dataType == "video"} name="data_type" id="video" />
          </div>
           <div className='flex items-center gap-2'>
            <input type="radio" value={"markdown"} onChange={(e) => changeType(e.target.value as TDataType)} checked={dataType == "markdown"} name="data_type" id="video" />
            <label htmlFor="video">Markdown</label>
          </div>
         
        </div>
        <div>
          <input type="text" placeholder='Enter the Arweave ID' value={id} onChange={(e) => setId(e.target.value)} name='arweave_id' className='h-12 px-4 mt-10 rounded-lg w-full outline-0 border border-gray-400' />
        </div>
      </div>

      <div className='max-w-[500px] max-h-[300px] overflow-scroll flex justify-center w-full'>
        <div>
          {(dataType == "image" && isImageLoading && isArweaveId(id)) && <div> Loading {dataType} ... </div>}
          {(dataType == "video" && isVideoLoading && isArweaveId(id)) && <div> Loading {dataType} ... </div>}
          {(dataType == "markdown" && isMarkDownLoading && isArweaveId(id)) && <div> Loading {dataType} ... </div>}
        </div>
        {(dataType == "image" && !isImageLoading && image?.src && !isImageError) && <div className='w-full h-full  border border-gray-200 rounded-lg p-2'>{JSON.stringify(image, null, 2)}</div>}
        {(dataType == "video" && !isVideoLoading && video?.src && !isVideoError) && <div className='w-full h-full  border border-gray-200 rounded-lg p-2'>{JSON.stringify(video, null, 2)}</div>}
        {(dataType == "markdown" && !isMarkDownLoading && markDown?.text && !isMarkDownError) && <div className='w-full h-full  border border-gray-200 rounded-lg p-2'>{markDown.text}</div>}
      </div>
    </div>
  )
}

export default App
