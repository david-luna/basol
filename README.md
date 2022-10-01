# basol

Basic observer library

[![GitHub license](https://img.shields.io/npm/l/csset.svg)](https://github.com/david-luna/basol/blob/master/README.md)
[![Issues](https://img.shields.io/github/issues/david-luna/basol.svg)](https://github.com/david-luna/basol/issues)
[![Build Status](https://github.com/david-luna/basol/actions/workflows/build.yml/badge.svg)](https://github.com/david-luna/basol/actions)
[![Coverage Status](https://img.shields.io/coveralls/github/david-luna/basol)](https://coveralls.io/github/david-luna/basol)
![Code Size](https://img.shields.io/bundlephobia/minzip/basol.svg)
![Weekly downloads](https://img.shields.io/npm/dw/basol.svg)

## Summary

This is a personal implementation of the observer pattern taking rxjs as a template for its API. This lib does not pretend to be a substitute or competitor of such library but rather a place for experiementation and learning.

The library tries to mimic the same API for producers (here called factories) and operators. Method signatures are extracted from the original [rxjs docs](https://rxjs.dev/guide/operators).

Tests try to be as accurate as possible but the behavior may differ. Also the implementations of the factories and
operators do not use utils and I tried to avoid any internal dependency.

## Release notes

### [0.4.0]

* Fix barrel files to expose latesat operators and factories

### [0.3.0]

* Add mergeMap operator

### [0.2.0]

* Add withLatestFrom operator

### [0.1.0]

* Add combineLatest factory method

### [0.0.3]

* Add fromEventPattern factory method
