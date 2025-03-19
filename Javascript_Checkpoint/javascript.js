//String Manipulation Functions

    //Reverse a String
    function reverseString(str) {
        return str.split('').reverse().join('');
    }

    //Count Characters
    function countCharacters(str) {
        return str.length;
    }

    //Capitalize Words
    function capitalizeWords(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }    

//Array Functions

    //Find Maximum and Minimum
    function findMax(arr) {
        return Math.max(...arr);
    }
    
    function findMin(arr) {
        return Math.min(...arr);
    }
    
    //Sum of Array
    function sumArray(arr) {
        return arr.reduce((acc, curr) => acc + curr, 0);
    }
    
    //Filter Array
    function filterArray(arr, condition) {
        return arr.filter(condition);
    }

//Mathematical Functions

    //Factorial
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }

    //Prime Number Check
    function isPrime(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    //Fibonacci Sequence
    function fibonacci(n) {
        let fib = [0, 1];
        for (let i = 2; i < n; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }
        return fib;
    }
    