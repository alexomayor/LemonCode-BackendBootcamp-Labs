## optional case

<!-- ///// NOT TO BE EVALUATED, THANKS /////

///// WORK IN PROGRESS //// -->

![image](./screenshot.png)

- I have created 6 main tables

1. home.

   - 3 arrays (5newestCourses, 5mostViewedCourses and allCoursesByTopic) The first 2 have embedded id, summary and name of the courses. SUBSET PATTERN applied to them, so the full list of courses is not loaded preloaded, improving loading times. Since not many courses will be added daily, the duplicity of this data should not present any serious problem.
     Regarding allCoursesByTopic, the necessary grouping has been made here, so consulting the table is faster for the browser.

2. courses.

   - title, summary, topic and price added as basic info that will be frequently requested.
   - usersRating will be calculated with less frequency, but constantly requested. COMPUTED PATTERN would work best. Ratings would be saved in a separate table, not included in this exercise.
   - subscriptionIncluded: Boolean, to know if the service paid memership includes or not access to each course. This is only true when all lessons are pay per view.
   - payToView: Boolean, to determine if there should be a pay-wall to access the course content. This is only true when all lessons are pay per view.
   - topic: This is included in oder to have a category tree, which would be made of 3 different levels.
   <!-- PATTERN ATTRIBUTE? -->
   - authors: Embedded id and name only, as it is the only data needed in the courses/lessons webpages. The rest of the authors data is included in its separate table, as it will not be consulted as much.

   - lessons: All lessons related data has been embedded in this table for quicker access. Videos and articles themselves are not included in this table, only URLs, so the Working Set should not be overloaded.
     -- author id and name has been embbeded. Same goes for topic.
     -- courseLessonsList: Needed to show current course's full list of lessons.
     -- subscriptionIncluded and payToView added also for lessons to cover the scenario where course is not 100% pay-per-view.

3. user
   All data needed to be shown in user's profile page, from personal information to payment details and purchased/enrolled courses as well as authors followed.
   The rest of the information related to purchases (invoice, amount, payment method used, and other billing data) can be stored in a separate table, which wont be visited as much.

4. authors
   Table used in authors' page. It contains all the information related to the authors, not to be heavily consulted.

5. Topics
   In order to have a hierarchy of topics, I included the id of each topic's parent.

6. Purchases
   All data that should be frozen by the time a purchase occurs, such as price paid (amount) or payment method, is included in this table (however, it is still missing fields, like shipping address or contact phone number). This information would not be consulted on a frequent basis.
