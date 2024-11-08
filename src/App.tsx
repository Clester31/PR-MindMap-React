import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import AddMediaDisplay from './components/AddMediaDisplay';
import ImageSelectionDisplay from './components/ImageSelectionDisplay';
import Canvas from './components/Canvas';
import NewNodeDisplay from './components/NewNodeDisplay';

interface Node {
  id: string;
  position: { x: number, y: number };
  nodeType: string;
  borderColor: string;
  text: string;
  image: string;
  video: string;
}

export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | undefined>();

  const [newNodeDisplay, setNewNodeDisplay] = useState<boolean>(false);
  const [mediaDisplay, setMediaDisplay] = useState<boolean>(false);
  const [imageSelectionDisplay, setImageSelectionDisplay] = useState<boolean>(false);

  const [mousePosition, setMousePosition] = useState<number[]>([0, 0])

  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    console.log(nodes);
  }, [nodes])

  const addNodeToCanvas = (
    nodeType: string | undefined, 
    nodeText: string | undefined, 
    mousePosition: number[]
  ) => {
    const newNode = {
      id: uuidv4(),
      position: { x: mousePosition[0], y: mousePosition[1] },
      nodeType: nodeType || 'none',
      borderColor: 'black',
      text: nodeText,
      image: "",
      video: ""
    }

    setNewNodeDisplay(false);
    setNodes((prev) => [...prev, newNode]);
  }

  const getNodePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition([e.clientX - 50, e.clientY-50])
    setNewNodeDisplay(true);
  }

  const handleAddMedia = (e: React.MouseEvent<HTMLButtonElement>, nodeId: string) => {
    e.stopPropagation();
    setMediaDisplay(true);
    setActiveNodeId(nodeId);
  }

  const handleAddImage = async () => {
    setImageSelectionDisplay(true);
    setMediaDisplay(false);
  }

  const handleAddVideo = () => {
    const query = prompt("paste a link to a youtube video here:");
    if (query) {
      setVideo(query);
      addVideoToNode(activeNodeId, query);
    }
  }

  const addImageToNode = (activeNodeId: string | undefined, image: string | undefined) => {
    console.log(activeNodeId);
    const updatedNodes = nodes.map((node: Node) => {
      if (node.id === activeNodeId) {
        return { ...node, image: image || "" }
      }
      return node;
    });
    setNodes(updatedNodes);
    setImageSelectionDisplay(false);
  }

  const addVideoToNode = (activeNodeId: string | undefined, video: string | undefined) => {
    const updatedNodes = nodes.map((node: Node) => {
      if (node.id === activeNodeId) {
        return { ...node, video: video || "" }
      }
      return node;
    })
    setNodes(updatedNodes);
  }

  const removeNode = (e: React.MouseEvent<HTMLButtonElement>, nodeId: string) => {
    e.stopPropagation();
    setNodes(nodes.filter(node => node.id !== nodeId))
  }

  return (
    <>
      <div className="p-4 flex flex-row">
        <h1 className="text-3xl font-bold underline">
          Mind Map
        </h1>
      </div>
      <main className="h-screen w-screen flex justify-center">
        <Canvas
          nodes={nodes}
          getNodePosition={getNodePosition}
          handleAddMedia={handleAddMedia}
          removeNode={removeNode}
        />
        {mediaDisplay &&
          <div
            className="media-display absolute rounded-xl border-2 border-black w-96"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50
            }}
          >
            {/* {addMediaDisplay({ handleAddImage, handleAddVideo })} */}
            <AddMediaDisplay handleAddImage={handleAddImage} handleAddVideo={handleAddVideo} />
          </div>
        }
        {imageSelectionDisplay &&
          <ImageSelectionDisplay
            addImageToNode={addImageToNode}
            setMediaDisplay={setMediaDisplay}
            setImageSelectionDisplay={setImageSelectionDisplay}
            activeNodeId={activeNodeId}
          />
        }
        {newNodeDisplay &&
          <div
            className="media-display absolute rounded-xl border-2 border-black w-96"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50
            }}
          >
            <NewNodeDisplay
              nodes={nodes}
              addNodeToCanvas={addNodeToCanvas}
              mousePosition={mousePosition}
              setNewNodeDisplay={setNewNodeDisplay}
            />
          </div>
        }
      </main>
    </>
  )
}

