const siteURL = process.env.SITE_URL;

export const state = () => ({
  menus: [],
  pages: [],
  posts: [],
  tags: []
})

export const mutations = {
  updateMenus: (state, menus) => {
    state.menus = menus
  },
  updatePages: (state, pages) => {
    state.pages = pages
  },
  updatePosts: (state, posts) => {
    state.posts = posts
  },
  updateTags: (state, tags) => {
    state.tags = tags
  }
}

const rtrim = (str, find) => str.replace(find, '');

const trimUrl = (url) => rtrim(url.replace(siteURL, ''), '/');

export const actions = {
  async getMenus({ state, commit, dispatch }) {
    if (state.menus.length) return

    try {
      let menus = await fetch(
        `${siteURL}wp-json/menus/v1/menus/main-nav`
      ).then(res => res.json())

      menus = menus.items
        .filter(el => el.post_status === "publish")
        .map(({ ID, title, url }) => ({
          id: ID,
          url: trimUrl(url),
          title
        }))

      commit("updateMenus", menus)
    } catch (err) {
      console.log(err)
    }
  },
  async getPages({ state, commit, dispatch }) {
    if (state.pages.length) return

    try {
      let pages = await fetch(
        `${siteURL}/wp-json/wp/v2/pages?per_page=1000`
      ).then(res => res.json())

      pages = pages
        .filter(el => el.status === "publish")
        .map(({ id, slug, title, excerpt, date, tags, content }) => ({
          id,
          slug,
          title,
          excerpt,
          date,
          tags,
          content
        }))

      commit("updatePages", pages)
    } catch (err) {
      console.log(err)
    }
  },
  async getPosts({ state, commit, dispatch }) {
    if (state.posts.length) return

    try {
      let posts = await fetch(
        `${siteURL}wp-json/wp/v2/posts?page=1&per_page=20&_embed=1`
      ).then(res => res.json())

      posts = posts
        .filter(el => el.status === "publish")
        .map(({ id, slug, title, excerpt, date, tags, content }) => ({
          id,
          slug,
          title,
          excerpt,
          date,
          tags,
          content
        }))

      commit("updatePosts", posts)
    } catch (err) {
      console.log(err)
    }
  },
  async getTags({ state, commit }) {
    if (state.tags.length) return

    let allTags = state.posts.reduce((acc, item) => {
      return acc.concat(item.tags)
    }, [])
    allTags = allTags.join()

    try {
      let tags = await fetch(
        `${siteURL}wp-json/wp/v2/tags?page=1&per_page=40&include=${allTags}`
      ).then(res => res.json())

      tags = tags.map(({ id, name }) => ({
        id,
        name
      }))

      commit("updateTags", tags)
    } catch (err) {
      console.log(err)
    }
  }
}
