import React, { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'

interface useBookSearchProps {
    query: string,
    pageNumber: number
}

const useBookSearch = ({query, pageNumber}:useBookSearchProps) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState<string[]>([])
    const [hasMore, setHasmore] = useState(false)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        console.log("PageNumber: ", pageNumber)
    }, [pageNumber])

    useEffect(() => {
       setLoading(true)
       setError(false)

        let cancel: any = null;
        axios({
            method: "GET",
            url: "http://openlibrary.org/search.json",
            params: {
                q: query, 
                page: pageNumber
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data?.docs.map((b:any) => b.title)])]
            })
            setHasmore(res.data.docs.length > 0)
            console.log(res.data)
            setLoading(false)
        }).catch(err => {
            if(axios.isCancel(err)) return
            setError(true)
        })


        return () => cancel()
    }, [query, pageNumber])


    return { loading, error, books, hasMore }
}

const InfiniteScrolling = () => {
    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const { loading, error, books, hasMore } = useBookSearch({query, pageNumber})

    const observer = useRef<any>() 
    const lastbookRef = useCallback((node: any) => {
        if(loading) return
        if(observer.current) observer.current?.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prev => prev + 1)
            }
        })
        if(node) observer.current?.observe(node)
    }, [loading, hasMore])
    
    

    const handleSearch = (e: React.FormEvent<HTMLInputElement>): void => {
        setQuery(e.currentTarget.value)
        setPageNumber(1)
    }
    return (
        <>
            <input type="text" value={query} onChange={handleSearch}></input>
            <ol>
            {
                books && books.map((bookTitle, index) => (
                    index+1 === books.length*0.5 ? <li key={index} ref={lastbookRef}>{bookTitle}</li> : <li key={index}>{bookTitle}</li>
                ))          
            }
            </ol>
            { loading && <div>Loading...</div>}
            { error && <div>Error!!!</div>}
        </>
    )
}

export default InfiniteScrolling