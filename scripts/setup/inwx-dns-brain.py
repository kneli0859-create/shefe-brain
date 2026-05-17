#!/usr/bin/env python3
"""Create A records for Brain subdomains on INWX (JSON-RPC).

Lessons from svd-clean-pro setup: XML-RPC needs session cookies that
Python's xmlrpc.client doesn't carry; JSON-RPC with a CookieJar works.
"""
import http.cookiejar
import json
import sys
import urllib.request

INWX_USER = 'claude-api'
INWX_PASS = 'Simal456@Simal'
VPS_IP    = '109.199.110.61'
DOMAIN    = 'svd-clean.de'
SUBDOMAINS = ['brain', 'api', 'webhook', 'agents']

_cj = http.cookiejar.CookieJar()
_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_cj))

def call(method, params):
    body = json.dumps({'method': method, 'params': params}).encode()
    req = urllib.request.Request(
        'https://api.domrobot.com/jsonrpc/',
        data=body,
        headers={'Content-Type': 'application/json', 'User-Agent': 'brain-cli/1.0'},
    )
    with _opener.open(req, timeout=20) as r:
        return json.loads(r.read())

def login():
    r = call('account.login', {'lang': 'en', 'user': INWX_USER, 'pass': INWX_PASS})
    if r.get('code') != 1000:
        print('LOGIN FAILED:', r); sys.exit(1)

def list_records():
    r = call('nameserver.info', {'domain': DOMAIN})
    if r.get('code') != 1000:
        print('ns.info failed:', r); sys.exit(1)
    return r['resData'].get('record', [])

def upsert(short_name, content):
    full = DOMAIN if short_name == '' else f'{short_name}.{DOMAIN}'
    matches = [r for r in list_records() if r['name'] == full and r['type'] == 'A']
    if matches:
        rec = matches[0]
        if rec['content'] == content:
            print(f'OK (no change)  {full:35s} -> {content}')
            return
        r = call('nameserver.updateRecord', {'id': int(rec['id']), 'content': content, 'ttl': 3600})
        status = 'OK' if r.get('code') == 1000 else 'FAIL'
        print(f'UPDATE  {status:4s}    {full:35s} -> {content}')
        return
    payload = {'domain': DOMAIN, 'type': 'A', 'content': content, 'ttl': 3600}
    if short_name:
        payload['name'] = short_name
    r = call('nameserver.createRecord', payload)
    status = 'OK' if r.get('code') == 1000 else 'FAIL'
    print(f'CREATE  {status:4s}    {full:35s} -> {content}')
    if r.get('code') != 1000:
        print('         detail:', r)

def main():
    login()
    for s in SUBDOMAINS:
        upsert(s, VPS_IP)
    call('account.logout', {})
    print('Done.')

if __name__ == '__main__':
    main()
