import { MdSearch } from "react-icons/md";
import { v4 } from "uuid";
import styles from "./index.module.css";
import { useContext, useEffect, useState, memo } from "react";
import ReactContext from "../../context/ReactContext";
import User from "../User";
import { webUrl } from "../../Common";
import Cookies from "js-cookie";
import PopupContext from "../../context/PopupContext";

import { IoIosArrowDown } from "react-icons/io";

import { Dropdown } from "primereact/dropdown";

const initialFilterArray = [
  {
    show: false,
    filterType: "city",
    data: [
      {
        name: "All",
        isSelected: true,
      },
      {
        name: "Vizag",
        isSelected: false,
      },
      {
        name: "Punjagutta",
        isSelected: false,
      },
    ],
  },
  {
    show: false,
    filterType: "coach",
    data: [
      {
        name: "All",
        isSelected: true,
      },
      {
        name: "Pawan",
        isSelected: false,
      },
      {
        name: "Tejas",
        isSelected: false,
      },
      {
        name: "Lavan",
        isSelected: false,
      },
    ],
  },
  {
    show: false,
    filterType: "Area",
    data: [
      {
        name: "All",
        isSelected: true,
      },
      {
        name: "Tg North",
        isSelected: false,
      },
      {
        name: "Tg South",
        isSelected: false,
      },
    ],
  },
  {
    show: false,
    filterType: "Stage",
    data: [
      {
        name: "All",
        isSelected: true,
      },
      {
        name: "1",
        isSelected: false,
      },
      {
        name: "2",
        isSelected: false,
      },
      {
        name: "3",
        isSelected: false,
      },
      {
        name: "4",
        isSelected: false,
      },
    ],
  },
];

function Sidebar() {
  const { users, setUsers, selectedUser } = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const { getOptions } = useContext(ReactContext);
  const [filterArray, setFilterArray] = useState(initialFilterArray);
  const [filteredUsers, setFilteredUser] = useState([]);
  const { hidePopup} = useContext(PopupContext) ;
  const getUserData = async () => {
    let token = Cookies.get("chat_token");
    try {
      setErr("");
      setIsLoading(true);
      const response = await fetch(`${webUrl}/users`, getOptions("POST"));
      if (response.ok) {
        const data = await response.json();
        console.log(data, "Okay");
        setUsers(data.data);
      } else {
        setErr("Failed to get");
      }
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFilterArray((prevArray) =>
      prevArray.map((eachFilter) => {
        return {
          ...eachFilter,
          show: false,
        };
      })
    );
  }, [ hidePopup])


  useEffect(() => {
    const selectedFilters = filterArray.map((each) => {
      const selectedOption = each.data.find(
        (eachOption) => eachOption.isSelected
      );
      return selectedOption ? selectedOption.name : null;
    });

    let [selectCity, selectedCoach, selectedArea, selectedStage] =
      selectedFilters;

    setFilteredUser((prevFilteredUser) => {
      return users.filter((each) => {
        if (selectedCoach === "All" || !selectedCoach) {
          return true;
        } else if (selectedCoach === each.coach) {
          return true;
        }
        return false;
      });
    });

}, [filterArray, users]);

  useEffect(() => {
    getUserData();
  }, []);

  const getErrorView = () => {
    return (
      <div className={styles.errorView}>
        <img
          loading="eager"
          src="https://image.freepik.com/free-vector/404-error-abstract-concept-illustration_335657-2243.jpg"
          alt="error image"
        />
        <h1>Something Went Wrong</h1>
        <p>{err}</p>
        <button onClick={getUserData}>Retry</button>
      </div>
    );
  };

  const setShowFilter = (filterType) => {
    setFilterArray((prevArray) =>
      prevArray.map((eachFilter) => {
        if (eachFilter.filterType === filterType) {
          return {
            ...eachFilter,
            show: !eachFilter.show,
          };
        }
        return {
          ...eachFilter,
          show: false,
        };
      })
    );
  };

  const onChangeFilterOption = (filterType, filterOption) => {
    setFilterArray((prevArray) =>
      prevArray.map((eachFilter) => {
        if (eachFilter.filterType === filterType) {
          return {
            ...eachFilter,
            data: eachFilter.data.map((eachOption) =>
              eachOption.name === filterOption
                ? {
                    ...eachOption,
                    isSelected: true,
                  }
                : { ...eachOption, isSelected: false }
            ),
          };
        }
        return eachFilter
        
      })
    );
  };

  return (
    <aside>
      <div className={styles.filterBtns} onClick={(e) => e.stopPropagation()}>
        {filterArray.map((eachFilter) => (
          <button
            key={v4()}
            className={styles.filterBtn}
            onClick={() => setShowFilter(eachFilter.filterType)}>
            {eachFilter.filterType.toUpperCase()}
            <IoIosArrowDown />
            {eachFilter.show && (
              <select
                value={eachFilter.data.find((each) => each.isSelected).name}
                onChange={(e) =>
                  onChangeFilterOption(eachFilter.filterType, e.target.value)
                }
                onClick={(e) => e.stopPropagation()}>
                {eachFilter.data.map((each) => (
                  <option key={v4()} value={each.name}>
                    {each.name}
                  </option>
                ))}
              </select>
            )}
          </button>
        ))}
      </div>
      <hr className={styles.hrLine} />
      <ul className={styles.userList}>
        {isLoading ? (
          <LoadingView />
        ) : err !== "" ? (
          getErrorView()
        ) : (
          filteredUsers?.map((each) => (
            <User
              isSelected={each?._id === selectedUser?._id}
              key={v4()}
              userDetails={each}
            />
          ))
        )}
      </ul>
    </aside>
  );
}

export default memo(Sidebar);

function LoadingView() {
  let n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <>
      {n.map((each) => (
        <li key={v4()} className={styles.userPlaceholder}>
          <div className={styles.placeholderImg}></div>
          <div className={styles.placeholderText}>
            <div className={styles.placeholderH1}></div>
            <div className={styles.placeholderP}></div>
          </div>
        </li>
      ))}
    </>
  );
}
