# Python 3.9 베이스 이미지 사용
FROM python:3.10

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY main.py /app/main.py
COPY requirements.txt /app/requirements.txt
COPY templates /app/templates
COPY static /app/static
COPY todo.json /app/todo.json

RUN groupadd -r myuser && useradd -r -g myuser myuser && \
    chown -R myuser:myuser /app && \
    pip install --no-cache-dir -r requirements.txt

USER myuser


# FastAPI 서버 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]