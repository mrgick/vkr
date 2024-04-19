FROM python:3.11.5-slim

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/src code
WORKDIR /code

EXPOSE 10000

CMD ["gunicorn", "settings.wsgi:application", "-w", "4", "--bind", "0.0.0.0:10000"]
