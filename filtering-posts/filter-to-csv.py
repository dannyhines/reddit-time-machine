import json
import csv
import os
from datetime import datetime, timezone, timedelta
from collections import defaultdict

def get_field(post, field):
    # Handle fields that might not exist
    return post.get(field)

def filter_posts(input_file):
    with open(input_file, 'r') as f:
        posts_by_date = defaultdict(list)
        
        for line in f:
            post = json.loads(line)
            desired_fields = {
                'id': get_field(post, 'id'),
                'title': get_field(post, 'title'),
                'url': get_field(post, 'url'),
                'created_utc': get_field(post, 'created_utc'),
                'author': get_field(post, 'author'),
                'domain': get_field(post, 'domain'),
                'hidden': get_field(post, 'hidden'),
                'score': get_field(post, 'score'),
                'ups': get_field(post, 'ups'),
                'downs': get_field(post, 'downs'),
                'is_reddit_media_domain': get_field(post, 'is_reddit_media_domain'),
                'is_video': get_field(post, 'is_video'),
                'num_comments': get_field(post, 'num_comments'),
                'num_crossposts': get_field(post, 'num_crossposts'),
                'permalink': get_field(post, 'permalink'),
                'preview': get_field(post, 'preview'),
                'subreddit': get_field(post, 'subreddit'),
                'subreddit_id': get_field(post, 'subreddit_id'),
                'thumbnail': get_field(post, 'thumbnail'),
                'thumbnail_height': get_field(post, 'thumbnail_height'),
                'thumbnail_width': get_field(post, 'thumbnail_width'),
            }

            # Convert created_utc to Central Time and get the date
            created_utc = get_field(post, 'created_utc')
            if created_utc:
                created_utc = int(created_utc)
                created_time = datetime.fromtimestamp(created_utc, tz=timezone.utc).astimezone(timezone(timedelta(hours=-6)))
                created_date = created_time.strftime('%Y-%m-%d')
                posts_by_date[created_date].append(desired_fields)
        
        # For each date, collect the top 25 posts based on the score
        for date in posts_by_date:
            posts_by_date[date] = sorted(posts_by_date[date], key=lambda x: x['score'], reverse=True)[:25]

        return posts_by_date

def write_to_csv(posts_by_date, output_file):
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=next(iter(posts_by_date.values()))[0].keys())
        writer.writeheader()
        for date in posts_by_date:
            for post in posts_by_date[date]:
                writer.writerow(post)

def main():
    # Assuming files are in the current directory with .ndjson extension
    for file in os.listdir('.'):
        if file.endswith('.json'):
            input_file = file
            output_file = file.replace('.json', '-filtered.csv')
            posts_by_date = filter_posts(input_file)
            write_to_csv(posts_by_date, output_file)

if __name__ == '__main__':
    main()
