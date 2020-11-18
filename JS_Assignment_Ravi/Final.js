function print() {
    var NumberOfSubjects = document.getElementById("NumberOfSubjects").value;
    var NumberOfStudents = document.getElementById("NumberOfStudents").value;
    var EnteredDataInString = document.getElementById("json").value;
    if (NumberOfSubjects === "") {
        alert("Number Of Subjects Can Not Be Empty");
        return;
    }
    if (NumberOfStudents === "") {
        alert("Number Of Students Can Not Be Empty");
        return;
    }
    if (EnteredDataInString === "") {
        alert("JSON Data Can Not Be Empty");
        return;
    }

    if (NumberOfSubjects > 5) {
        alert("You can enter Upto 5 subjects");
        return;
    }
    if (NumberOfStudents > 100) {
        alert("A class can not have more than 100 students"); 2
        return;
    }
    output(NumberOfSubjects, NumberOfStudents, EnteredDataInString);
}

//output
function output(NOS, NOST, data) {
    if (!jsonFormatCheck(data)) {
        alert("Invalid Json Input");
        return;
    }
    if (!NumberOfSubjectCodesCheck(data, NOS)) {
        alert("Number Of Subject Mismatch");
        return;
    }
    if (!NumberOfStudentCodesCheck(data, NOST)) {
        alert("Number Of Student Mismatch");
        return;
    }
    if (!ValidityOfSubjectCode(data)) {
        alert("Subject Code Error");
        return;
    }
    if (!ValidityOfStudentCode(data)) {
        alert("Student Code Error");
        return;
    }
    if (!DuplicateSubjectCodeCheck(data, data)) {
        alert("Duplicate SubjectCode");
        return;
    }
    if (!DuplicateStudentIdCheck(data)) {
        alert("Duplicate StudentId");
        return;
    }
    if (!SameStudentCheck(NOS, data)) {
        alert("Student IdMismatch");
        return;
    }
    const average = calcAverage(data, NOS);
    const final = separateData(average, data);
    for (let stuId in final) {
        if (final[stuId].length != NOS)
            delete final[stuId];
    }
    if (Object.keys(final).length==0)
    {
        document.getElementById('output').innerText = "None of The Students Satisfy The Condition";
    }
    else{    
    document.getElementById('output').innerText = JSON.stringify(final);
}
}


//JsonValidation
function jsonFormatCheck(data) {
    try {
        JSON.parse(data);
    } catch (err) {
        return false;
    }
    return true;
}


//StudentNumberMismatch
function NumberOfStudentCodesCheck(data, NumOfStu) {
    data = JSON.parse(data);
    for (let i in data) {
        if (data[i].length != NumOfStu) {
            return false;
        }
    }
    return true;
}
//NumberOfSubjectCodeMismatch
function NumberOfSubjectCodesCheck(data, NumofSub) {
    data = JSON.parse(data);
    if (Object.keys(data).length != NumofSub) {
        return false;
    }
    return true;
}
//ValidityOfSubjectCodes
function ValidityOfSubjectCode(data) {
    data = JSON.parse(data);
    let re = /[a-zA-Z]/;
    for (let SubCode of Object.keys(data)) {
        if ((SubCode.length != 3) || !(re.test(SubCode))) {
            return (false);
        }
    }
    return (true);
}

//ValidityOfStudentCodes
function ValidityOfStudentCode(data) {
    data = JSON.parse(data);
    let re = /([a-zA-Z]{3})([0-9]{3})/;
    for (let SubCode in data) {
        for (let StudentCode of data[SubCode]) {
            if ((Object.keys(StudentCode)[0].length != 6) || (!re.test(Object.keys(StudentCode)[0]))) {
                return (false);
            }
        }
    }
    return (true);
}
//DuplicacyOfSubjectCode
function DuplicateSubjectCodeCheck(data, EnteredData) {
    data = JSON.parse(data);
    if (EnteredData.split("],").length != Object.keys(data).length)
        return false;
    return true;
}

//DuplicacyOfStudentId
function DuplicateStudentIdCheck(data) {
    data = JSON.parse(data);
    for (let sub in data) {
        let students = {};
        for (let obj of data[sub]) {
            let key = Object.keys(obj)[0];
            if (students[key])
                return false;
            students[key] = true;
        }
    }
    return true;
}


//StudentMismatch
function SameStudentCheck(numSub, data) {
    const students = {}
    data = JSON.parse(data);
    for (let i in data) {
        data[i].forEach((val, ind) => {
            const key = Object.keys(val);
            if (key in students) {
                students[key] += 1;
            } else {
                students[key] = 1;
            }
        })
    }
    for (let i in students) {
        if (students[i] != numSub)
            return false;
    }
    return true;
}

//CalculateAverage
function calcAverage(data, NumOfStu) {
    const SubWiseAverage = {};
    data = JSON.parse(data);
    for (let i in data) {
        const average =
            data[i].reduce((total, val) => (total += val[Object.keys(val)]), 0) / NumOfStu;
        SubWiseAverage[i] = average;
    }
    document.getElementById('ave').innerText = JSON.stringify(SubWiseAverage);
    return SubWiseAverage;
}
//Separate
function separateData(average, data) {
    const finalData = {};
    data = JSON.parse(data);
    for (let i in data) {
        data[i].forEach((val) => {
            const number = val[Object.keys(val)];
            if (number >= average[i]) {
                const obj = {};
                obj[i] = number;
                const key = Object.keys(val);
                if (key in finalData) {
                    finalData[key].push(obj);
                } else {
                    finalData[key] = [obj];
                }
            }
        });
    }
    return finalData;
}
