import React, {useEffect, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IImage, srcUrl } from '../interfaces/IImage';
import AppBackend from "../backend/AppBackend";
import './Focus.css';
import {useHistory} from "react-router";
import CloseButton from "./CloseButton";
import {IGallery} from "../interfaces/IGallery";

type FocusProps = {
  image: IImage,
  previousId: number,
  nextId: number,
  gallery: IGallery,
  color: string
}

function Focus({ image, previousId, nextId, gallery, color }: FocusProps){
  const [srcUrl, setSrcUrl] = useState({src:image.src, url:"NOT_FOUND"});
  const [visibleTextPanel, setVisibleTextPanel] = useState(window.innerWidth > 600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const history = useHistory();

  function goTo(path :string) :void {
    history.push('/' + path);
  }

  useEffect( () => {
    async function loadImage() {
      setLoading(true);
      setError(false);
      try{
        const u :srcUrl = await AppBackend.getUrlFixedHeight(image.src, 600);
        setSrcUrl(u);
      }
      catch (err) {
        setError(true);
      }
      setLoading(false);
    }
    loadImage();
  }, [image])

  const textPanel = <div
    className={"Focus-textPanel"}
    style={{borderColor:color, color:color, visibility:visibleTextPanel ? "initial" : "hidden"}}
    onClick={() => setVisibleTextPanel(false)}
  >
    <span style={{backgroundColor:color}}>{gallery.title}</span>
    <h2>{image.dateLabel}</h2>
    <h1>{image.title}</h1>
    <p>{image.description}</p>
  </div>;

  const closeTextPanel = <div
    className={"Focus-openTextPanel"}
    onClick={() => setVisibleTextPanel(true)}
    style={{textShadow : `0 1px 2px rgba(0, 0, 0, 0.3), 3px 2px 0 ${color}, 1px 2px 4px rgba(0, 0, 0, 0.3)`}}
  >
    <span>+</span>
  </div>

  const imagePanel = <div className={"Focus-imagePanel"}>
    <CSSTransition
      in={!loading}
      timeout={750}
      classNames={"Focus-transition-opacity"}
    >
      <img className={"Focus-img"} src={srcUrl.url} alt={image.src} />
    </CSSTransition>
  </div>;

  return <div>
    <div className={"Focus"}>
      {textPanel}
      {closeTextPanel}
      {error
        ? <div className={"Focus-placeholder"}>Erreur, impossible de charger l'image.</div>
        : imagePanel
      }
      <div
        className={"Focus-prev-next Focus-prev Focus-button"} onClick={() => goTo(`gallery-${gallery.id}/focus-${previousId}`)}
        style={{visibility:(previousId > 0 ? "visible" : "hidden")}}
      >
        <span>❬</span>
      </div>
      <div
        className={"Focus-prev-next Focus-next Focus-button"} onClick={() => goTo(`gallery-${gallery.id}/focus-${nextId}`)}
        style={{visibility:(nextId > 0 ? "visible" : "hidden")}}
      >
        <span> ❭ </span>
      </div>
    </div>
    <CloseButton onClick={() => goTo(`gallery-${gallery.id}`)}/>
  </div>
}

export default Focus;