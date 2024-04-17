const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')


dotenv.config({path: 'config.env'})
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/validatorMiddleware')
const dbConnection = require('./config/database')
const categoryRoute = require('./routes/categoryRoute')
const subcategoryRoute = require('./routes/subCategoryRoute')
const brandRoute = require('./routes/brandRoute')
const productsRoute = require('./routes/productRoute')

dbConnection()
const app = express();


// Middlewares
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode ${process.env.NODE_ENV}`);
}

// routes

app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subcategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productsRoute);

app.all('*', (req, res, next) => {
    next(new ApiError(`Cann't find this route: ${req.originalUrl}`, 400))
})

// Global error handling middleware
app.use(globalError)

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log( `Server listen to port ${PORT}!`);
});

// handled Rejections outside express
process.on('unhandledRejection', () => {
    server.close(()=> {
            console.error(`Shitting down....`)
            process.exit(1);
        })
})