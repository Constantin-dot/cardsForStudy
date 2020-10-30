import classes from './Cards.module.scss';
import React, {useMemo} from 'react';
import Table, {ITableModel} from '../../../n1-main/m1-ui/common/Table/Table';
import {StatusType} from "../../../n1-main/m2-bll/reducers/app-reducer";
import EditableTableCell from '../../../n1-main/m1-ui/common/Table/EditableTableCell/EditableTableCell';
import {Search} from "../../../n1-main/m1-ui/common/Search/Search";
import {TableButton} from '../../../n1-main/m1-ui/common/Table/TableButton/TableButton';
import {CardsSearchParamsType} from '../../../n1-main/m2-bll/reducers/cards-reducer';
import {CardType} from "../../../n1-main/m3-dal/cards-api";
import {Paginator} from "../../../n1-main/m1-ui/common/Paginator/Paginator";
import {ColumnSorting} from "../../../n1-main/m1-ui/common/ColumnSorting/ColumnSorting";

type PropsType = {
    cards: Array<CardType> | null
    owner: boolean
    page: number
    pageCount: number
    min: number | undefined
    max: number | undefined
    cardsTotalCount: number
    searchParams: CardsSearchParamsType
    deleteCard: (id: string) => void
    createCard: (question: string) => void
    updateCard: (cardId: string, question: string) => void
    changePage: (page: number) => void
    changePageCount: (page: number) => void
    setSearchParams: (searchName?: string, min?: number, max?: number) => void
    pageStatus: StatusType
    setSortColumn: (sortCards: string) => void
}

const Cards: React.FC<PropsType> = React.memo((props) => {
    let {
        cards, page, owner, setSortColumn,
        pageCount, cardsTotalCount,
        createCard, deleteCard, updateCard, changePage,
        changePageCount, setSearchParams, pageStatus,
        min, max, searchParams: {cardQuestion}
    } = props
    // console.log("packs")

    const testModel: ITableModel[] = useMemo(() => ([
        {
            title: (i: number) => (<th style={{width: "30%", padding: "10px 0 10px 20px"}} key={i}>
                <span>Question</span>
            </th>),
            render: (d: CardType, i: number) => (
                <td style={{width: "30%", padding: "10px 10px 10px 20px"}} key={i}>
                    {
                        owner
                            ? <EditableTableCell text={d.question} changeText={(text) => updateCard(text, d._id)}/>
                            : <span>{d.question}</span>
                    }
                </td>)
        },
        {
            title: (i: number) => (<th style={{width: "30%", padding: "10px 0"}} key={i}>Answer</th>),
            render: (d: CardType, i: number) => (
                <td style={{width: "30%", padding: "10px 0"}} key={i}>{d.answer}</td>)
        },
        {
            title: (i: number) => (<th style={{width: "15%", padding: "10px 0"}} key={i}>
                <span>Added</span>
            </th>),
            render: (d: CardType, i: number) => {

                let dm = new Date(d.created)
                let year = dm.getFullYear()
                let month = dm.getMonth() < 10 ? "0" + dm.getMonth() : dm.getMonth()
                let day = dm.getDay() < 10 ? "0" + dm.getDay() : dm.getDay()

                return <td style={{width: "15%", padding: "10px 0"}} key={i}>{`${year}-${month}-${day}`}</td>
            }

        },
        {
            title: (i: number) => (
                <th style={{width: "15%", padding: "10px 0", display: "flex", alignItems: "center"}} key={i}>
                    <div>Grade</div>
                    <ColumnSorting onClick={(sort)=>setSortColumn(sort + "grade")}/>
                </th>),
            render: (d: CardType, i: number) => (
                <td style={{width: "15%", padding: "10px 0"}} key={i}>{d.grade}</td>)
        },
        {
            title: (i: number) => (
                <th style={{width: "10%", padding: "10px 20px 10px 0", textAlign: "right"}} key={i}>
                    <TableButton btnName={"+"} btnType={"green"} onClick={() => createCard("new card")}
                                 disabled={!owner || pageStatus === "loading"}/>
                </th>
            ),
            render: (d: CardType, i: number) => {
                return <td style={{width: "10%", padding: "10px 20px 10px 0", textAlign: "right"}} key={i}>
                    <TableButton btnName={"x"} btnType={"red"} onClick={() => deleteCard(d._id)}
                                 disabled={!owner || pageStatus === "loading"}/>
                </td>
            }
        },

    ]), [pageStatus, owner]);

    return (
        <div className={classes.packs}>
            <div className={classes.packs__container}>

                <div className={classes.packs__title}>
                    <h3>Cards</h3>
                </div>
                <div className={classes.packs__body}>
                    <Search name={cardQuestion}
                            label={"Search"}
                            minValue={min ? min : 0}
                            maxValue={max ? max : 0}
                            stepValue={1}
                            setSearchParams={setSearchParams}/>
                    <Table data={cards}
                           model={testModel}
                           pageStatus={pageStatus}/>
                </div>
                <div>
                    <Paginator currentPage={page}
                               itemsTotalCount={cardsTotalCount}
                               pageCount={pageCount}
                               changePage={changePage}
                               changePageCount={changePageCount}
                               itemsName={"cards"}/>
                </div>
            </div>
        </div>
    );
})

export default Cards;