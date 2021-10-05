let api_base_url = ''

if (process.env.NODE_ENV === 'development') {
	api_base_url = '/api'
} else if (process.env.NODE_ENV === 'production') {
	api_base_url = 'https://wyy.djtc.vip/'
}

export default {
	api_base_url
}
