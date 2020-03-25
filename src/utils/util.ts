import qs from 'querystring'
import loaDebounce from 'lodash/debounce'
import { pathToRegexp } from 'path-to-regexp'
export const isDev = () => {
  const { NODE_ENV } = process.env

  if (NODE_ENV === 'development') {
    return true
  }

  return false
}
export const getPageQuery = () => qs.parse(window.location.href.split('?')[1])
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname: string) => {
  const authority = router.find(({ path }) => path && pathToRegexp(path).exec(pathname))
  if (authority) return authority
  return undefined
}

export function isRight(value: any) {
  if (typeof value === 'undefined') {
    return false
  } else if (typeof value === 'number') {
    return value.toString()
  } else if (typeof value === 'string') {
    return value.replace(/ /g, '').replace(/\n/g, '')
  } else if (value instanceof Array) {
    return value.length
  } else {
    return value
  }
}

export const sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))

export const debounce = (fn: Function, time = 500) => loaDebounce(fn, time)

export const deep = (obj: object) => {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    console.log(e)
    return obj
  }
}
