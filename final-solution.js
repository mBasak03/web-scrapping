const cheerio = require("cheerio");
// const fetch = require("node-fetch");

const courseUrlBase = "https://www.shiksha.com/studyabroad/canada/universities/";

const fetchCourses = async (courseUrl) => {
  try {
    const response = await fetch(courseUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const courses = [];
    let count= 0;
    
    $('div[class="_7911 acp_course_tuple "]').each((index, element) => {

      /* const courseName = $(element).find('h3.f7cc').text().trim();
      const feesText = $(element).find('div[class="dcfd undefined"]').text();
      const fees = feesText.includes("₹") ? feesText.split("₹")[1].trim() : "Not Available";
      const duration = $(element).find('div[class="edfa"] span').text().trim() || "Not Available";
      
      courses.push({
        "course Name": courseName,
        "fees": fees,
        "course duration": duration
      }); */


    });

    return courses;
  } catch (error) {
    console.error(`Error fetching courses from ${courseUrl}: `, error.message);
    return [];
  }
};

const scrapData = async () => {
  try {
    const url = "https://www.shiksha.com/studyabroad/canada/universities-3";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const institutions = [];

    const institutionElements = $('div[class="_1822 _0fc7 _7efa"]');

    for (let index = 0; index < institutionElements.length; index++) {
      const element = institutionElements[index];
      
      const collegeName = $(element).find('h3[class="f7cc"]').text().trim();
      const collegeLocation = $(element).find('span[class="_5588"]').text().trim();
      const firstYearTuitionText = $(element).find('div[class="_77ff"]').eq(1).text();
      const firstYearTuition = firstYearTuitionText.includes("₹") ? firstYearTuitionText.split("₹")[1].trim() : "Not Available";

      const graduationMarks = $(element).find('div[class="_77ff"]').eq(3).find('div[class="dcfd undefined"]').text();

      const numberOfCoursesText = $(element).find('div[class="_77ff"]').eq(0).find('div[class="dcfd undefined"]').text();
      const numberOfCourses = numberOfCoursesText ? numberOfCoursesText.trim().split(" ")[0].trim() : "Not Available";

      const urlPart = collegeName.split(" ").join("-").toLowerCase();
      const courseUrl = `${courseUrlBase}${urlPart}/courses?ctry[]=8&CUP`;

      const courses = await fetchCourses(courseUrl);

      institutions.push({
        "University": collegeName,
        "University location": collegeLocation,
        "1st year tuition fees": firstYearTuition,
        "Minimum graduation Marks/ work exp": graduationMarks === "– / –" ? "Not Available" : graduationMarks,
        "Number of courses offered": numberOfCourses,
        "Course details": courses,
      });
    }

    console.log(JSON.stringify(institutions, null, 2));
  } catch (error) {
    console.error("Error fetching the page: ", error.message);
  }
};

scrapData();