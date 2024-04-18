FROM python:3.11.5-slim

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ code
WORKDIR /code

EXPOSE 10000

ENTRYPOINT ["python", "src/manage.py"]
CMD ["runserver", "0.0.0.0:10000"]
