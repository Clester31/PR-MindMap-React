import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import AddMediaDisplay from "./components/AddMediaDisplay";
import ImageSelectionDisplay from "./components/ImageSelectionDisplay";
import Canvas from "./components/Canvas";
import NewNodeDisplay from "./components/NewNodeDisplay";
import VideoPlayer from "./components/VideoPlayer";
import { Node } from "./Types/types";
import { useAppContext } from "./context/Context";
import Navbar from "./components/Navbar";
import AssetAccordian from "./components/AssetAccordian";
import EditAssetTextDisplay from "./components/EditAssetTextDisplay";
import FullImageDisplay from "./components/FullImageDisplay";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GoalSetting from "./components/GoalSetting";

export default function App() {
  const {
    nodes,
    setNodes,
    activeNodeId,
    setActiveNodeId,
    video,
    setVideo,
    videoPlayer,
    setVideoPlayer,
    selectedValue,
    editTextDisplay,
    fullImageDisplay,
  } = useAppContext();

  const [newNodeDisplay, setNewNodeDisplay] = useState<boolean>(false);
  const [mediaDisplay, setMediaDisplay] = useState<boolean>(false);
  const [imageSelectionDisplay, setImageSelectionDisplay] =
    useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
  // function for adding node onto the canvas
  const addNodeToCanvas = (
    nodeType: string | undefined,
    nodeText: string | undefined,
    mousePosition: number[],
    connectingNode: Node
  ) => {
    // createa a new node
    if (nodeType === "role" && nodeText?.length === 0) {
      alert("cannot have empty text field");
    } else {
      const newNode = {
        id: uuidv4(),
        position: { x: mousePosition[0], y: mousePosition[1] },
        nodeType: nodeType || "none",
        borderColor: "black",
        text: nodeText || "",
        image: "",
        video: "",
        childNodes: [],
      };

      // if its a role, then add the node into the role nodes
      // also connect it to the center value node
      if (newNode.nodeType === "role") {
        selectedValue.childNodes.push(newNode);
      }

      // add asset node to the asset nodes
      if (newNode.nodeType === "asset") {
        selectedValue.childNodes.map((role) => {
          if (role.id === connectingNode.id) {
            role.childNodes.push(newNode);
          }
        });
      }
      // hide new node display
      setNewNodeDisplay(false);
      console.log("selected value", selectedValue);
      // update the list of all nodes
      // setNodes((prev) => [...prev, newNode]);
    }
  };

  // gets the current position of where the user clicked so that the node can be palced there
  const getNodePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    // mouse position has to be modified since by default it starts at the top left of the node instead of the center
    // offset it by half the the node size to get mouse clicks centered
    setMousePosition([e.clientX - 110 / 2, e.clientY - 110 / 2]);
    setNewNodeDisplay(true);
  };

  // helper function for the add media display
  const handleAddMedia = (
    e: React.MouseEvent<HTMLButtonElement>,
    nodeId: string
  ) => {
    // prevents a new node being added on top when clicking on a node
    e.stopPropagation();
    setMediaDisplay(true);
    // set the active node ID so that way we can place the image at the node we want
    setActiveNodeId(nodeId);
  };

  // brings up/hides some displays
  const handleAddImage = async () => {
    setImageSelectionDisplay(true);
    setMediaDisplay(false);
  };

  // right now will prompt the user to add a youtube link
  // Most likely gonna get changed soon
  const handleAddVideo = () => {
    const query = prompt("paste a link to a youtube video here:");
    if (query) {
      setVideo(query);
      addVideoToNode(activeNodeId, query);
    }
  };

  // update the current node to have an image take up the entire node surface area
  const addImageToNode = (
    activeNodeId: string | undefined,
    image: string | undefined
  ) => {
    if (image) {
      selectedValue.childNodes.forEach((role) => {
        role.childNodes.forEach((asset) => {
          if (asset.id === activeNodeId) {
            if (asset.video) {
              asset.video = ""; // if user tries to update a video node to an image node, it removes the video
            }
            asset.image = image;
          }
        });
      });
    }
    setImageSelectionDisplay(false);
  };

  // just like adding images except this one adds a link to access the video p
  const addVideoToNode = (
    activeNodeId: string | undefined,
    video: string | undefined
  ) => {
    if (video) {
      selectedValue.childNodes.forEach((role) => {
        role.childNodes.forEach((asset) => {
          if (asset.id === activeNodeId) {
            if (asset.image) {
              asset.image = ""; // if user tries to update an image node to a video node, it removes the image
            }
            asset.video = video;
          }
        });
      });
    }
    setMediaDisplay(false);
  };

  // removes a node from the array
  // still have to update this for asset nodes as well since removing a role node doesn't remove its asset nodes
  const removeNode = (node: Node) => {
    //e.stopPropagation();
    console.log("click");

    if (node.nodeType === "role") {
      selectedValue.childNodes = selectedValue.childNodes.filter(
        (role) => role.id !== node.id
      );
    } else {
      selectedValue.childNodes.forEach((role) => {
        role.childNodes = role.childNodes.filter(
          (asset) => asset.id !== node.id
        );
      });
    }

    setNodes((prevNodes) => {
      return prevNodes.map((n) => {
        if (n.id === selectedValue.id) {
          return { ...n, childNodes: selectedValue.childNodes };
        }
        return n;
      });
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex">
        {!fullImageDisplay && !videoPlayer && <AssetAccordian />}
        <Canvas
          getNodePosition={getNodePosition}
          handleAddMedia={handleAddMedia}
          removeNode={removeNode}
        />
        {mediaDisplay && (
          <div
            className="media-display absolute shadow-xl w-1/3"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          >
            {/* {addMediaDisplay({ handleAddImage, handleAddVideo })} */}
            <AddMediaDisplay
              handleAddImage={handleAddImage}
              handleAddVideo={handleAddVideo}
              setMediaDisplay={setMediaDisplay}
            />
          </div>
        )}
        {imageSelectionDisplay && (
          <ImageSelectionDisplay
            addImageToNode={addImageToNode}
            setMediaDisplay={setMediaDisplay}
            setImageSelectionDisplay={setImageSelectionDisplay}
            activeNodeId={activeNodeId}
          />
        )}
        {newNodeDisplay && (
          <div
            className="media-display absolute rounded-xl w-1/3"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          >
            <NewNodeDisplay
              nodes={nodes}
              addNodeToCanvas={addNodeToCanvas}
              mousePosition={mousePosition}
              setNewNodeDisplay={setNewNodeDisplay}
              setImageSelectionDisplay={setImageSelectionDisplay}
            />
          </div>
        )}
        {videoPlayer && (
          <VideoPlayer video={video} setVideoPlayer={setVideoPlayer} />
        )}
        {fullImageDisplay && <FullImageDisplay />}
        {editTextDisplay && (
          <div
            className="media-display absolute rounded-xl w-1/3"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          >
            <EditAssetTextDisplay />
          </div>
        )}
      </main>
    </>
  );
}
