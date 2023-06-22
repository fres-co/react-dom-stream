import React, { useCallback, useRef } from "react";
import logo from "./logo.svg";

const styles = {
  sourceIframe: {
    width: 500,
    height: 500,
  },
};

function Main() {
  return (
    <div>
      <iframe src="/#source" style={styles.sourceIframe} />

      <iframe src="/#dest" style={styles.sourceIframe} />
    </div>
  );
}

function Source() {
  const [count, setCounter] = React.useState(0);

  const observerRef = useRef(null);
  const onRef = useCallback((node) => {
    if(observerRef.current) {
      observerRef.current.disconnect();
    }
    if (node) {
      window.parent.postMessage({ type: 'sync', data: node.innerHTML});

      const config = { attributes: true, childList: true, subtree: true, characterData: true };
      const observer = new MutationObserver(() => {debugger;
        window.parent.postMessage({ type: 'sync', data: node.innerHTML});
      });

      observer.observe(node, config);
      observerRef.current = observer;
    }
  }, []);
  return (
    <div ref={onRef}>
      source
      <button onClick={() => setCounter(count + 1)}>
        click me for more
      </button>
      Current value is {count}
      <img src={logo} />
      <audio controls src="pop01.mp3" autoPlay/>
    </div>
  );
}
function Dest() {

  const [content, setContent] = React.useState('');
  React.useEffect(() => {

    window.parent.addEventListener('message', (data) => {
      setContent(data.data.data)
    })
  }, []);
  return (
    <div >
      <style>{'button { visibility: hidden;}'}</style>
      dest
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}

function App() {
  if (document.location.hash === "#source") {
    return <Source />;
  }

  if (document.location.hash === "#dest") {
    return <Dest />;
  }
  return <Main />;
}

export default App;
