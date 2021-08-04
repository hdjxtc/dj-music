let api_base_url = ''

if (process.env.NODE_ENV === 'development') {
<<<<<<< HEAD
  api_base_url = '/api'
} else if (process.env.NODE_ENV === 'production') {
  // api_base_url = 'https://wyy.djtc.vip/'
=======
  // api_base_url = 'http://localhost:3000'
  api_base_url = '/api'
} else if (process.env.NODE_ENV === 'production') {
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
  api_base_url = 'https://wyy.djtc.vip/'
}

export default { api_base_url }
