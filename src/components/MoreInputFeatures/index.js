import styles from "./index.module.css";

const MoreInputFeatures = ({ setShowDocMenu, showDocMenu }) => {
  const dataPreview = () => {
    return (
      preview && (
        <div className={styles.previewContainer} id="preview-container">
          <div>
            {preview.startsWith("data:image") && (
              <img
                src={preview}
                alt="Preview"
                height="100%"
                // width="100%"
              />
            )}
            {preview.startsWith("data:video") && (
              <video controls style={{ maxWidth: "100%", maxHeight: "300px" }}>
                <source src={preview} type={preview.type} />
                Your browser does not support the video tag.
              </video>
            )}
            {preview.startsWith("data:application/pdf") && (
              <embed
                src={preview}
                type="application/pdf"
                width="100%"
                height="300px"
              />
            )}
          </div>
          <button
            type="button"
            onClick={updateFile}
            className={styles.sendFileBtn}>
            <IoSend />
          </button>
        </div>
      )
    );
  };

  const getDocMenu = () => {
    return (
      showDocMenu && (
        <div className={styles.addFilesDiv}>
          <div className={styles.fileUploadDiv}>
            <input
              onChange={onUpdateFile}
              type="file"
              id="file"
              accept="image/jpeg, image/png, video/mp4"
            />
            <label htmlFor="file">
              <MdOutlineInsertPhoto />
              Photo & Video
            </label>
          </div>
          <div className={styles.fileUploadDiv}>
            <input
              onChange={(e) => setFolder(e.target)}
              type="file"
              id="documents"
              accept=".pdf,video/*,image/*"
            />
            <label htmlFor="documents">
              <MdOutlineInsertPhoto />
              Document
            </label>
          </div>
        </div>
      )
    );
  };
  
  return (
    <>
      <MoreInputFeatures />
      {dataPreview()}
      {getDocMenu()}
      <button type="button" className={styles.featureBtn}>
        <MdOutlineEmojiEmotions size={20} color="violet" />
      </button>
      <button
        className={styles.featureBtn}
        type="button"
        onClick={() => setShowDocMenu((n) => !n)}>
        <FaPlus size={20} color="violet" />
      </button>
      <button type="button" className={styles.featureBtn}>
        <PiNotePencilFill size={20} color="violet" />
      </button>
    </>
  );
};
