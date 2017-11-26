/*
 * App common variables
 */
export default {
  env: {
    production: 'production',
    development: 'development',
    test: 'test'
  },

  path: {
    upload: `${process.cwd()}/uploads/`
  },

  // Code conventions
  conventions: {
    number: 0,
    array: [],
    string: '',
    object: null
  },

  // Regex
  regex: {
    objectId: /^[0-9a-fA-F]{24}$/,
    phone: /^\+?1?(\d{10,12}$)/
  },

  // Limit
  limit: {
    customers: {
      all: 20
    }
  },

  // Mail template
  mailTemplates: {
    invitation: 'invitation'
  },

  // File
  file: {
    types: {
      photo: 'photo',
      zip: 'zip',
      excel: 'excel'
    }
  },

  // App locales
  locales: {
    list: 'en vi',
    en: 'en',
    vi: 'vi'
  },

  cities: {
    list: 'all da-nang ho-chi-minh ha-noi',
    all: 'da-nang ho-chi-minh ha-noi',
    daNang: 'da-nang',
    hoChiMinh: 'ho-chi-minh',
    haNoi: 'ha-noi'
  },

  genders: {
    list: 'all male female',
    all: 'all',
    male: 'male',
    female: 'female'
  },

  // User
  user: {
    roles: {
      admin: 'admin',
      staff: 'staff'
    },
    validate: {
      nameMinLength: 3,
      nameMaxLength: 32
    }
  }
}
