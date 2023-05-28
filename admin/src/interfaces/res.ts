export interface Res<T> extends Response {
  data: {
    status: number
    message?: string
    data: T
  }
}
