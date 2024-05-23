import React, { useContext, useEffect, useState, memo } from "react";
import { v4 } from "uuid";
import styles from "./index.module.css";
import { webUrl, timestampToDateTime, apiStatusConstants } from "../../Common";
import { FaImage } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactContext from "../../context/ReactContext";

import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
import { TailSpin } from "react-loader-spinner";

const initialEditedUser = {
  from: "",
  name: "",
  coach: "",
  area: "",
  stage: "",
  center: "",
};

const PatientEditForm = (props) => {
  const { editPopupOpen, setEditPopupOpen, userDetails, setSelectedUser } =
    props;
  const { patient_phone_number } = userDetails;
  const [loading, setLoading] = useState(false);
  const { getOptions, setUsers } = useContext(ReactContext);
  const [err, setErr] = useState("");
  const [editUserDetails, setEditUserDetails] = useState(initialEditedUser);

  useEffect(() => {
    setEditUserDetails({
      from: userDetails.patient_phone_number,
      name: userDetails.name,
      coach: userDetails.coach,
      area: userDetails.area,
      stage: userDetails.stage,
      center: userDetails.center,
    });
  }, [userDetails]);

  const updateDetails = async () => {
    try {
      setErr("");
      setLoading(true);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = getOptions("POST", editUserDetails);
      let response = await fetch(`${webUrl}/update-patient`, options);
      let responseData = await response.json();

      if (response.ok) {
        setUsers((prevState) =>
          prevState.map((each) => {
            if (
              each.patient_phone_number === userDetails.patient_phone_number
            ) {
              return {
                ...each,
                ...editUserDetails,
              };
            }
            return each;
          })
        );
        // setSelectedUser((prevState) => ({
        //   ...prevState,
        //   ...editUserDetails,
        // }));
      } else {
        setErr(responseData.msg || "error");
      }
    } catch (error) {
      setErr(error.message || "error");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateDetails = (event) => {
    event.preventDefault();
    updateDetails();
  };

  const updateInput = (event) => {
    setEditUserDetails({
      ...editUserDetails,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Popup
      nested
      open={editPopupOpen}
      modal
      position="right center"
      onClose={() => setEditPopupOpen(false)}>
      <form className={styles.editUserPopup} onSubmit={onUpdateDetails}>
        <div className={styles.editUserPopupInputContainer}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editUserDetails.name}
            onChange={updateInput}
          />
        </div>
        <div className={styles.editUserPopupInputContainer}>
          <label htmlFor="coach">Coach</label>
          <input
            type="text"
            id="coach"
            name="coach"
            value={editUserDetails.coach}
            onChange={updateInput}
          />
        </div>
        <div className={styles.editUserPopupInputContainer}>
          <label htmlFor="area">Area</label>
          <input
            type="text"
            id="area"
            name="area"
            value={editUserDetails.area}
            onChange={updateInput}
          />
        </div>
        <div className={styles.editUserPopupInputContainer}>
          <label htmlFor="stage">Stage</label>
          <input
            type="text"
            id="stage"
            name="stage"
            value={editUserDetails.stage}
            onChange={updateInput}
          />
        </div>
        <div className={styles.editUserPopupInputContainer}>
          <label htmlFor="center">Center</label>
          <input
            type="text"
            id="center"
            name="center"
            value={editUserDetails.center}
            onChange={updateInput}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <TailSpin height={20} width={20} color="white" />
          ) : err ? (
            "Retry"
          ) : (
            "Update"
          )}
        </button>
      </form>
    </Popup>
  );
};

export default memo(PatientEditForm);
