# Reddit Comment Checker

This project is a simple tool to check the last comment date of a Reddit user. It uses the Reddit API to fetch the user's comments and returns the date of the last comment.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install`

## Usage

1. Create a CSV file with the Reddit usernames you want to check. The file should have a header row with the column names `username` and `bio`.
2. Save the CSV file in the project directory.
3. Run the command `npm run checkRedditData` to process the CSV file.
4. The output will be saved in a new CSV file named `reddit_out.csv`. The output file will have the same format as the input file, with the last comment date added as a new column.

## Example

Suppose you have a CSV file named `reddit.csv` with the following content:

```
username, bio
darrenrogan,asdasd
friendlyjordies,asdasdgdfg
dave,asdasd
asdas,ty
```

After running the command `npm run checkRedditData`, a new file `reddit_out.csv` will be created with the following content:

```
username, last_comment_date
darrenrogan,Fri Dec 13 2024 13:57:45 GMT+1000 (Australian Eastern Standard Time)
friendlyjordies,No comments found for this user
dave,Fri Dec 06 2024 04:41:41 GMT+1000 (Australian Eastern Standard Time)
asdas,API Error: Request failed with status code 403  #No user
```

In this example, the last comment date for the user `darrenrogan` is `Fri Dec 13 2024 13:57:45 GMT+1000 (Australian Eastern Standard Time)`, the last comment date for the user `friendlyjordies` is `No comments found for this user`, the last comment date for the user `dave` is `Fri Dec 06 2024 04:41:41 GMT+1000 (Australian Eastern Standard Time)`, and the last comment date for the user `asdas` is `API Error: Request failed with status code 403`.



