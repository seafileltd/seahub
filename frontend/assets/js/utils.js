const sortBy = (type, field) => {
    switch (type) {
        case "string" :
            return (a, b) => (a[field] < b[field]) ? -1 : 1;
        default:
            return (a, b) => b[field] - a[field];
    }
}

export const sortReposFunc = sort =>
    (sort === "SORTED_BY_NAME") ?
        sortBy("string", "name") :
        (sort === "SORTED_BY_SIZE") ?
            sortBy("number", "size") :
            sortBy("number", "mtime")
