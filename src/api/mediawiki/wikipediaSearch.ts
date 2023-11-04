import axios from 'axios';

export interface SearchResult {
    title: string;
    key: string;
    url: string;
}

export const wikipediaSearch=(keyword: string):Promise<SearchResult>=> {
    const apiUrl = 'https://zh.wikipedia.org/w/rest.php/v1/search/page?q='+encodeURIComponent(keyword)+'&limit=1';
    let searchResult: SearchResult
    return axios({
        method: 'get',
        url: apiUrl,
    }).then((response) => {
        if(response.status !== 200) {
            searchResult={
                title: 'null',
                key: 'null',
                url: 'null',
            }
            throw new Error('wikipedia search failed');
        }else if(response.data.pages.length === 0) {
            searchResult={
                title: 'null',
                key: 'null',
                url: 'null',
            }
        }else {
            searchResult={
                title: response.data.pages[0].title,
                key: response.data.pages[0].key,
                url: 'https://zh.wikipedia.org/wiki/'+response.data.pages[0].key,
            }
        }
        return searchResult;
    });
}

