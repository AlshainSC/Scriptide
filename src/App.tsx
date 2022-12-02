import { useState } from "react";
import { useScriptideContext } from "./contexts/ScriptideProvider";

// context
import ScriptideProvider from "./contexts/ScriptideProvider";

//components
import { IDE } from "./components/IDE";
import { OutputWindow } from "./components/OutputWindow";
import { OutputDetails } from "./components/OutputDetails";
import Porthole from "./components/Porthole";
import { ThemeDropdown } from "./components/ThemeDropdown";
import { LanguageDropdown } from "./components/LanguageDropdown";
import { SideBar } from "./components/SideBar";

//dependencies
import React, { useEffect, SetStateAction } from "react";
import axios from "axios";
import { invoke } from "@tauri-apps/api";
import { ToastContainer, toast } from "react-toastify";
import { window as tauriWindow } from "@tauri-apps/api";

////////////////////////////////////////////////////////chimeintegration -> TODO
import { ThemeProvider } from "styled-components";
import {
  MeetingProvider,
  lightTheme,
  NotificationProvider,
  useNotificationDispatch,
  ActionType,
  Severity,
  // useLocalVideo
} from "amazon-chime-sdk-component-library-react";
import MeetingContainer from "./components/MeetingContainer";
import Meeting from "./components/Meeting";
import MeetingForm from "./components/MeetingForm";

import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
// @ts-ignore
Amplify.configure(awsconfig);

//////////////////////////////////////////////////////////////////////liveblocks
import { useOthers, useUpdateMyPresence } from "./liveblocks.config.js";

//css
import "./App.css";

//utility
import { languageOptions } from "./constants/languageOptions";
import { defineTheme } from "./lib/defineTheme.js";
import useKeyPress from "./hooks/useKeyPress";
import NavBar from "./components/navBarComponents/NavBar";
import { handleCompile } from "./utils/apiServices.js";

//constants
const submissions = import.meta.env.VITE_RAPIDAPI_SUBMISSIONS;
const host = import.meta.env.VITE_RAPIDAPI_HOST;
const key = import.meta.env.VITE_RAPIDAPI_KEY;

export default function App() {
  const {
    processing,
    setProcessing,
    language,
    setLanguage,
    code,
    setCode,
    theme,
    setTheme,
    meetingActive,
    menuState,
    setMenuState,
  } = useScriptideContext();

  const updateMyPresence = useUpdateMyPresence();

  // const { tileId, isVideoEnabled, hasReachedVideoLimit, toggleVideo } = useLocalVideo();

  // const enterPress = useKeyPress("Enter");
  // const ctrlPress = useKeyPress("Control");

  const noDragSelector = "input, a, button, #ide-view-open";
  document.addEventListener("mousedown", async (mouseDown: any) => {
    if (mouseDown.target.closest(noDragSelector)) {
      return;
    }
    await tauriWindow.appWindow.startDragging();
  });

  // function handleCompile() {
  //   //@ts-ignore
  //   setProcessing(true);
  //   const formData = {
  //     language_id: language.id,
  //     source_code: btoa(code),
  //     stdin: btoa(''),
  //   };
  //   console.log(formData);
  //   const options = {
  //     method: "POST",
  //     url: submissions,
  //     params: { base64_encoded: true, fields: "*" },
  //     headers: {
  //       "content-type": "application/json",
  //       "Content-Type": "application/json",
  //       "X-RapidAPI-Host": host,
  //       "X-RapidAPI-KEY": key,
  //     },
  //     data: formData,
  //   };

  //   axios
  //     .request(options)
  //     .then(function (response: any) {
  //       console.log("res.data: ", response.data);
  //       const token = response.data.token;
  //       console.log("token: ", token);
  //       checkStatus(token);
  //     })
  //     .catch((err: any) => {
  //       console.log(options);
  //       let error = err.response ? err.response.data : err;
  //       //@ts-ignore
  //       setProcessing(false);
  //       console.log({ error });
  //     });
  // }

  // async function checkStatus(token: any) {
  //   const options = {
  //     method: "GET",
  //     url: submissions + "/" + token,
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "X-RapidAPI-Host": host,
  //       "X-RapidAPI-Key": key,
  //     },
  //   };
  //   try {
  //     let response = await axios.request(options);
  //     let statusId = response.data.status?.id;

  //     // Processed - we have a result
  //     if (statusId === 1 || statusId === 2) {
  //       // still processing
  //       setTimeout(() => {
  //         checkStatus(token);
  //       }, 2000);
  //       return;
  //     } else {
  //       //@ts-ignore
  //       setProcessing(false);
  //       setOutputDetails(response.data);
  //       showSuccessToast(`Compiled Successfully!`);
  //       console.log("response.data", response.data);
  //       return;
  //     }
  //   } catch (err: any) {
  //     console.log("err", err);
  //     //@ts-ignore
  //     setProcessing(false);
  //     showErrorToast(err);
  //   }
  // }

  // function showSuccessToast(message: string) {
  //   toast.success(message || "Compiled Successfuly", {
  //     position: "top-left",
  //     autoClose: 5000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // }

  // function showErrorToast(message: string) {
  //   toast.error(message || "Compile Failed", {
  //     position: "top-left",
  //     autoClose: 5000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // }

  // function onSelectChange(select: SetStateAction<any>) {
  //   console.log("selected: ", select);
  //   setLanguage(select);
  // }

  // function onChange(action: any, data: any) {
  //   switch (action) {
  //     case "code": {
  //       setCode(data);
  //       break;
  //     }
  //     default: {
  //       console.warn("case not handled: ", action, data);
  //     }
  //   }
  // }

  function handleThemeChange(th: any) {
    const theme = th;
    console.log("theme: ", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_: any) => setTheme(theme.value));
    }
  }

  const getLocalPreview = async () => {
    try {
      console.log("NAV", navigator);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log("STREAM", stream);
      return stream;
    } catch (error) {
      //this is when user don't allow media devices
      console.log(error);
    }
  };

  const holes = ["cam", "ide", "grid"];

  // useEffect(() => {
  //   if (enterPress && ctrlPress) {
  //     console.log("enter: ", enterPress);
  //     console.log("control: ", ctrlPress);
  //     handleCompile();
  //   }
  // }, [ctrlPress, enterPress]);

  /////////////////////////////////////////////////////////////////////////////////////////////////liveblocks
  function Cursor({ x, y }) {
    return (
      <img
        style={{
          position: "absolute",
          transform: `translate(${x}px, ${y}px)`,
          height: "15px",
          width: "15px",
        }}
        src="src/assets/cursor.png"
      />
    );
  }

  const others = useOthers();

  return (
    // <div data-tauri-drag-region>
    <div
      className="App"
      onPointerMove={(e) =>
        updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } })
      }
      onPointerLeave={() => updateMyPresence({ cursor: null })}
    >
      {others.map(({ connectionId, presence }) =>
        presence.cursor ? (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        ) : null
      )}
      <ThemeProvider theme={lightTheme}>
        {/* @ts-ignore */}
        <MeetingProvider>
          {!meetingActive ? (
            <div id="center-flex">
              <MeetingForm />
            </div>
          ) : (
            <Meeting />
          )}
        </MeetingProvider>
      </ThemeProvider>
    </div>
  );
}
