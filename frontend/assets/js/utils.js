export const sortRepos = (repos=[], sortBy="mtime") => {
  if (sortBy === 'mtime') {
    return repos.sort((a, b) => a['mtime'] - b['mtime'])
  } else if (sortBy === 'size') {
    return repos.sort((a, b) => a['size'] - b['size'])
  } else if (sortBy === 'name') {
     let a = repos.sort((a, b) => a['name'] - b['name'])
    console.log(a);
    return a;
  }
}
