# xcroll

**A client for [fikfap](https://fikfap.com/)**

## Prerequisites

- [Node.js](https://nodejs.org/en) (Ensure Node.js is installed on your system)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/thedr4c0/xcroll.git
   cd xcroll
   ```

2. **Install Dependencies**

   ```bash
   ./setup.sh
   ```

## Usage

1. **Start the Application**

   Navigate to the `xcroll` directory and run:

   ```bash
   npm start
   ```

2. **Scraping Video Links**

   To scrape video links, navigate to the `scraper` directory:

   ```bash
   cd scraper
   npm run dev
   ```

   This will output all video links to `./data/links.txt`. You can view these links in your browser to download files manually.

3. **Automated Download**

   To automatically download all video files, execute the following script:

   ```bash
   ./download.sh
   ```

   > [!WARNING]
   > it will try to download all the links listed in `links.txt`.
   > you can press `Ctrl + c` to quit downloading

   > This will download the video files to the `./data` directory. To play all videos sequentially, run:

   ```bash
   vlc .
   ```

4. **Automated Scraping and Downloading**

   For a streamlined process, you can run the following command from the root directory:

   ```bash
   npm run scrape
   ```

   This command will handle both scraping and downloading in one go.

## Additional Notes

- Ensure all commands are run from the appropriate directories as specified.
- Verify that all necessary permissions are granted for script execution.
