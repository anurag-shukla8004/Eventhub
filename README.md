# EventHub - Simplified Event Management System
``` bash
git clone https://github.com/your-username/EventHub.git
cd EventHub
npm install
npm run dev
``` 
# SQL Query Optimization
SQL Query Optimization:
1.Indexed key fields like date, title, and event_id for faster searches.

2.Paginated results to manage large data sets and reduce load times.

3.Optimized SQL joins to fetch related data efficiently.

4.Dynamic queries based on filters for better performance.

5.Used WHERE clauses to filter data at the database level, minimizing processing.

6.In-memory SQLite database for fast data access and lightweight performance.

# Frontend :

React Functional Components: We used React functional components, which are more concise and easier to maintain compared to class-based components.

Tailwind CSS: For styling, we used Tailwind CSS to write utility-first CSS. This allows for rapid development and easy-to-read code, with built-in responsiveness and customizable themes.

Dynamic Event Filtering: Filters like event name, location, and date range are implemented dynamically, allowing users to quickly filter events on the client-side.

Component Reusability: Components like EventCard, EventFilter, and LoadingSpinner are designed to be reusable across the app, promoting cleaner code and easier maintenance.

Conditional Rendering: Used conditional rendering for loading states, empty states, and error handling, ensuring a smooth user experience during data fetching and other asynchronous operations.

Next.js API Routes: We leveraged Next.js API routes to handle server-side logic such as fetching events, registering users, and gathering analytics. This makes the front-end development more modular and clean.

State Management: Used React’s useState and useEffect hooks to manage and track states such as loading, error messages, and fetched event data, improving performance and responsiveness.

Optimized Data Fetching: We used fetch for API calls and managed asynchronous state updates efficiently to ensure the page loads quickly, even with larger data sets like 1 million events.