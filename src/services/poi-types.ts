export interface RawPOI {
  name: string,
  description: string,
  location: {
    lat: number,
    lon: number
  },
  categories: string[],
  imageURL: string[],
  thumbnailURL: string,
  contributor: string,
  _id: string
}

export interface POI {
  name: string,
  description: string,
  location: {
    lat: number,
    lon: number,
  }
  categories: Category[],
  imageURL: string[],
  thumbnailURL: string,
  contributor: User,
  _id: string;
}

export interface RawCategory {
  name: string,
  description: string,
  contributor: string,
  _id: string
}

export interface Category {
  name: string,
  description: string,
  contributor: User,
  _id: string
}

export interface RawUser {
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  password: string,
  isAdmin: boolean,
  customCategories: number,
  contributedPOIs: number,
  _id: string
}

export interface User {
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  password: string,
  isAdmin: boolean,
  customCategories: number,
  contributedPOIs: number,
  _id: string
}

export interface Location {
  lat: number;
  lon: number;
}
