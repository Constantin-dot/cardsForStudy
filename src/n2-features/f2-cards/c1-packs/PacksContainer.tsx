import React, {ChangeEvent, useCallback, useEffect} from 'react';
import Packs from "./Packs";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../n1-main/m2-bll/store";
import {
    changePageAC,
    changePageCountAC,
    createPackTC,
    deletePackTC,
    getPacksTC, PacksStateType, setPacksSortColumnAC, setSearchParamsAC, setUserIdAC,
    updatePackTC
} from "../../../n1-main/m2-bll/reducers/packs-reducer";
import {Preloader} from "../../../n1-main/m1-ui/common/Preloader/Preloader";
import {setPackAC} from "../../../n1-main/m2-bll/reducers/cards-reducer";
import {useHistory} from 'react-router-dom';


const PacksContainer = React.memo(() => {

    // console.log("packs container")
    const history = useHistory()
    const dispatch = useDispatch()
    const {packs, min, max, page, pageCount, cardPacksTotalCount, pageStatus, searchParams, getMyPacks} =
        useSelector<RootStateType, PacksStateType>(state => state.packs)
    const userId = useSelector<RootStateType, string | undefined>(state => state.profile.userData?._id)


    const deletePackHandler = useCallback((id: string) => {
        dispatch(deletePackTC(id))
    }, [])
    const createPackHandler = useCallback((name: string) => {
        dispatch(createPackTC(name))
    }, [])
    const updatePackHandler = useCallback((name: string, id: string) => {
        dispatch(updatePackTC(name, id))
    }, [])
    const changePageHandler = useCallback((page: number) => {
        dispatch(changePageAC(page))
    }, [])
    const changePageCountHandler = useCallback((pageCount: number) => {
        dispatch(changePageCountAC(pageCount))
    }, [])
    const setSearchParamsHandler = useCallback((searchName: string, min: number, max: number) => {
        dispatch(setSearchParamsAC(searchName, min, max))
    }, [])
    const setPacksSortColumnHandler = useCallback((sortPacks: string) => {
        dispatch(setPacksSortColumnAC(sortPacks))
    }, [])
    const choosePackHandler = useCallback((packId: string, cardsOwner: string) => {
        dispatch(setPackAC(packId, cardsOwner))
        history.push(`/cards/${packId}`)
    }, [])
    const startLearnHandler = useCallback((packId: string, cardsOwner: string) => {
        dispatch(setPackAC(packId, cardsOwner))
        history.push(`/learn/${packId}`)
    }, [])
    const setGettingMyPacks = (checkboxValue: boolean) => {
        if (checkboxValue) {
            dispatch(setUserIdAC(userId as string))
        } else {
            dispatch(setUserIdAC(""))
        }
    }

    useEffect(() => {
        dispatch(getPacksTC())
    }, [page, pageCount, searchParams, getMyPacks])

    if (!packs || pageStatus === "idle") {
        return <Preloader/>
    }

    return (
        <Packs packs={packs}
               userId={userId}
               page={page}
               min={min}
               max={max}
               pageCount={pageCount}
               searchParams={searchParams}
               cardPacksTotalCount={cardPacksTotalCount}
               createPack={createPackHandler}
               deletePack={deletePackHandler}
               updatePack={updatePackHandler}
               changePage={changePageHandler}
               choosePack={choosePackHandler}
               startLearn={startLearnHandler}
               setPacksSortColumn={setPacksSortColumnHandler}
               changePageCount={changePageCountHandler}
               setSearchParams={setSearchParamsHandler}
               pageStatus={pageStatus}
               setGettingMyPacks={setGettingMyPacks}
        />
    );
})

export default PacksContainer;
